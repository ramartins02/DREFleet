<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\SendDocumentExpiryNotification;
use App\Jobs\SendOrderOccurrenceNotification;
use App\Jobs\SendAccesssoryExpiryNotification;
use App\Jobs\SendDriverLicenseExpiryNotification;
use App\Jobs\SendOrderRequiresApprovalNotification;
use App\Jobs\SendUnfilledKilometrageReportEntryNotification;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


// Notification Jobs
Schedule::job(new SendDocumentExpiryNotification)->weekly();

Schedule::job(new SendAccesssoryExpiryNotification)->weekly();

Schedule::job(new SendDriverLicenseExpiryNotification)->weekly();

Schedule::job(new SendOrderRequiresApprovalNotification)->weekly();

Schedule::job(new SendUnfilledKilometrageReportEntryNotification)->monthly();