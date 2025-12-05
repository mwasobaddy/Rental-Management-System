<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('profile_completed_at')->nullable()->after('email_verified_at');
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('google_id')->nullable()->after('remember_token');
            $table->string('avatar')->nullable()->after('google_id');
            $table->boolean('has_google_linked')->default(false)->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_completed_at', 'first_name', 'last_name', 'google_id', 'avatar', 'has_google_linked']);
        });
    }
};