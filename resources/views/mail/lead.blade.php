<!DOCTYPE html>
<html lang="ka">
    <head>
        <meta charset="utf-8">
    </head>
    <body style="margin:0;padding:24px;background:#f6f4f0;font-family:Arial,Helvetica,sans-serif;color:#161616;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e2dc;">
            <tr>
                <td style="padding:24px 28px 8px;">
                    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#ff6a5b;font-weight:bold;">WebSavvys</p>
                    <h1 style="margin:0;font-size:20px;">ახალი მოთხოვნა საიტიდან</h1>
                </td>
            </tr>
            <tr>
                <td style="padding:8px 28px 24px;font-size:15px;line-height:1.6;">
                    <p style="margin:12px 0 0;"><strong>სახელი:</strong> {{ $lead->name }}</p>
                    <p style="margin:4px 0 0;"><strong>ტელეფონი:</strong> <a href="tel:{{ preg_replace('/[^0-9+]/', '', $lead->phone) }}" style="color:#161616;">{{ $lead->phone }}</a></p>
                    <p style="margin:4px 0 0;"><strong>საიტის ტიპი:</strong> {{ $typeLabel }}</p>
                    @if ($lead->message)
                        <p style="margin:16px 0 4px;"><strong>შეტყობინება:</strong></p>
                        <p style="margin:0;padding:12px 14px;background:#f6f4f0;white-space:pre-wrap;">{{ $lead->message }}</p>
                    @endif
                    <p style="margin:20px 0 0;">
                        <a href="{{ route('admin.leads') }}" style="display:inline-block;padding:10px 18px;background:#161616;color:#ffffff;text-decoration:none;font-weight:bold;">ყველა მოთხოვნა</a>
                    </p>
                </td>
            </tr>
        </table>
    </body>
</html>
