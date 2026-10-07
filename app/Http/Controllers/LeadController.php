<?php

namespace App\Http\Controllers;

use App\Mail\LeadReceived;
use App\Models\Lead;
use App\Support\LocaleContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Throwable;

use function Illuminate\Support\defer;

class LeadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Honeypot: only bots fill this field.
        if ($request->filled('lead_ref')) {
            return response()->json(['ok' => true], 201);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^\+?[0-9\s().\-]{6,}$/'],
            'website_type' => ['nullable', Rule::in(array_keys(config('pricing.types')))],
            'message' => ['nullable', 'string', 'max:2000'],
            'locale' => ['nullable', Rule::in(array_keys(config('seo.locales')))],
        ]);

        $lead = Lead::create([...$data, 'ip' => $request->ip()]);

        // Runs after the response, so a slow mail server never delays the form.
        defer(fn () => $this->notifyByEmail($lead));

        return response()->json(['ok' => true], 201);
    }

    private function notifyByEmail(Lead $lead): void
    {
        $to = config('admin.leads_email');

        if (! $to) {
            return;
        }

        $types = collect(LocaleContent::load('ka')['pricing']['types'] ?? [])->pluck('name', 'key');

        try {
            Mail::to($to)->send(new LeadReceived($lead, $types[$lead->website_type] ?? 'ჯერ არ იცის'));
        } catch (Throwable $e) {
            report($e);
        }
    }
}
