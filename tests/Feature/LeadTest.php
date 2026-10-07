<?php

use App\Mail\LeadReceived;
use App\Models\Lead;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    $this->withoutDefer();
});

function validLead(array $overrides = []): array
{
    return [
        'name' => 'Nino Beridze',
        'phone' => '+995 555 12 34 56',
        'website_type' => 'business',
        'message' => 'We need a website for our clinic.',
        'locale' => 'ka',
        ...$overrides,
    ];
}

test('a contact form request is stored as new', function () {
    $this->postJson(route('leads.store'), validLead())->assertCreated();

    expect(Lead::sole()->only(['name', 'phone', 'website_type', 'message', 'locale', 'status']))->toBe([
        'name' => 'Nino Beridze',
        'phone' => '+995 555 12 34 56',
        'website_type' => 'business',
        'message' => 'We need a website for our clinic.',
        'locale' => 'ka',
        'status' => 'new',
    ]);
});

test('a new request is emailed to the configured address', function () {
    config(['admin.leads_email' => 'staff@example.com']);

    $this->postJson(route('leads.store'), validLead())->assertCreated();

    Mail::assertSent(LeadReceived::class, function (LeadReceived $mail) {
        $mail->assertHasSubject('ახალი მოთხოვნა საიტიდან: Nino Beridze')
            ->assertSeeInHtml('Nino Beridze')
            ->assertSeeInHtml('+995 555 12 34 56')
            ->assertSeeInHtml('ბიზნეს ვებსაიტი')
            ->assertSeeInHtml('We need a website for our clinic.');

        return $mail->hasTo('staff@example.com') && $mail->hasFrom(config('mail.from.address'), 'New Client');
    });
});

test('no email is sent when no address is configured', function () {
    config(['admin.leads_email' => null]);

    $this->postJson(route('leads.store'), validLead())->assertCreated();

    expect(Lead::count())->toBe(1);
    Mail::assertNothingSent();
});

test('a failing mail server does not lose the request', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('smtp down'));
    Exceptions::fake();

    $this->postJson(route('leads.store'), validLead())->assertCreated();

    expect(Lead::count())->toBe(1);
    Exceptions::assertReported(RuntimeException::class);
});

test('only a name and a phone number are required', function () {
    $this->postJson(route('leads.store'), ['name' => 'Giorgi', 'phone' => '555123456', 'website_type' => '', 'message' => ''])->assertCreated();

    expect(Lead::sole()->only(['website_type', 'message']))->toBe(['website_type' => null, 'message' => null]);
});

test('invalid input is rejected with per-field errors and nothing is stored', function () {
    $this->postJson(route('leads.store'), validLead(['name' => '', 'phone' => 'call me', 'website_type' => 'spaceship']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'phone', 'website_type']);

    expect(Lead::count())->toBe(0);
});

test('a filled honeypot looks successful but stores nothing', function () {
    $this->postJson(route('leads.store'), validLead(['lead_ref' => 'Acme Bots Ltd']))->assertCreated();

    expect(Lead::count())->toBe(0);
    Mail::assertNothingSent();
});

test('the form is rate limited per visitor', function () {
    foreach (range(1, 5) as $attempt) {
        $this->postJson(route('leads.store'), validLead())->assertCreated();
    }

    $this->postJson(route('leads.store'), validLead())->assertTooManyRequests();
});

test('the requests page is only for signed-in admins', function () {
    $this->get(route('admin.leads'))->assertRedirect(route('admin.login'));
});

test('an admin can list, filter, update and delete requests', function () {
    $new = Lead::create(['name' => 'New One', 'phone' => '555000001']);
    $done = Lead::create(['name' => 'Done One', 'phone' => '555000002', 'status' => 'contacted']);
    $admin = $this->withSession(['admin_authenticated' => true]);

    $admin->get(route('admin.leads'))->assertInertia(fn ($page) => $page
        ->component('Admin/Leads')
        ->where('counts', ['all' => 2, 'new' => 1, 'contacted' => 1])
        ->has('leads.data', 2)
        ->where('typeLabels.landing', 'Landing Page'));

    $admin->get(route('admin.leads', ['status' => 'contacted']))->assertInertia(fn ($page) => $page
        ->has('leads.data', 1)
        ->where('leads.data.0.name', 'Done One'));

    $admin->patch(route('admin.leads.update', $new), ['status' => 'contacted'])->assertRedirect();
    expect($new->fresh()->status)->toBe('contacted');

    $admin->patch(route('admin.leads.update', $new), ['status' => 'archived'])->assertSessionHasErrors('status');

    $admin->delete(route('admin.leads.destroy', $done))->assertRedirect();
    expect(Lead::pluck('name')->all())->toBe(['New One']);
});

test('the dashboard reports how many requests are still new', function () {
    Lead::create(['name' => 'New One', 'phone' => '555000001']);
    Lead::create(['name' => 'Done One', 'phone' => '555000002', 'status' => 'contacted']);

    $this->withSession(['admin_authenticated' => true])->get(route('admin.dashboard'))
        ->assertInertia(fn ($page) => $page->where('newLeads', 1));
});
