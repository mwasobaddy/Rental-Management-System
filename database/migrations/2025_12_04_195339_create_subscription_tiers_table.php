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
        Schema::create('subscription_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Starter, Professional, Enterprise
            $table->string('slug')->unique(); // starter, professional, enterprise
            $table->text('description')->nullable();
            $table->decimal('price_monthly', 10, 2); // Monthly price
            $table->decimal('price_yearly', 10, 2)->nullable(); // Yearly price (optional discount)
            $table->integer('max_properties')->nullable(); // null = unlimited
            $table->integer('max_units')->nullable(); // null = unlimited
            $table->integer('max_tenants')->nullable(); // null = unlimited
            $table->json('features')->nullable(); // Array of features
            $table->boolean('is_popular')->default(false); // Highlight as popular
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_tiers');
    }
};
