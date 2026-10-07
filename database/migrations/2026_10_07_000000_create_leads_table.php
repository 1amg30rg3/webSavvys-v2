<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('phone', 32);
            $table->string('website_type', 20)->nullable();
            $table->text('message')->nullable();
            $table->string('locale', 5)->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('status', 16)->default('new')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
