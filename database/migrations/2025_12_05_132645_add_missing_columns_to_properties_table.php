<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->integer('total_units')->default(1)->after('year_built');
            $table->date('purchase_date')->nullable()->after('total_units');
            $table->decimal('monthly_rent', 10, 2)->nullable()->after('purchase_date');
            $table->string('status')->default('active')->after('monthly_rent');
            $table->decimal('latitude', 10, 8)->nullable()->after('status');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->json('images')->nullable()->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['total_units', 'purchase_date', 'monthly_rent', 'status', 'latitude', 'longitude', 'images']);
        });
    }
};
