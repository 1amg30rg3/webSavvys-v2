<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->index();
            $table->string('path', 255)->index();
            $table->string('locale', 5)->nullable();
            $table->string('referrer', 255)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device', 16)->default('desktop');
            $table->string('browser', 32)->nullable();
            $table->string('os', 32)->nullable();
            $table->boolean('is_bot')->default(false)->index();
            $table->timestamp('visited_at')->useCurrent()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
