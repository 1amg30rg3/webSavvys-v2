<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class LeadReceived extends Mailable
{
    public function __construct(public Lead $lead, public string $typeLabel) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), 'New Client'),
            subject: 'ახალი მოთხოვნა საიტიდან: '.$this->lead->name,
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.lead');
    }
}
