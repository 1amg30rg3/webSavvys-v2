<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Support\LocaleContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LeadsController extends Controller
{
    public function index(Request $request): Response
    {
        $status = in_array($request->query('status'), Lead::STATUSES, true) ? $request->query('status') : '';

        return Inertia::render('Admin/Leads', [
            'status' => $status,
            'counts' => [
                'all' => Lead::count(),
                'new' => Lead::where('status', 'new')->count(),
                'contacted' => Lead::where('status', 'contacted')->count(),
            ],
            'leads' => Lead::query()
                ->when($status !== '', fn ($q) => $q->where('status', $status))
                ->latest('id')
                ->paginate(20, ['id', 'name', 'phone', 'website_type', 'message', 'locale', 'status', 'created_at'])
                ->withQueryString(),
            'typeLabels' => collect(LocaleContent::load('en')['pricing']['types'] ?? [])->pluck('name', 'key'),
        ]);
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $lead->update($request->validate(['status' => ['required', Rule::in(Lead::STATUSES)]]));

        return back();
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        return back();
    }
}
