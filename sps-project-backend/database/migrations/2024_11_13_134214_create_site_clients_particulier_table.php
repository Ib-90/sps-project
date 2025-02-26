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
        Schema::create('site_clients_particulier', function (Blueprint $table) {
            $table->id();
            $table->string('codeSiteClient');
            $table->string('name');
            $table->string('prenom');
            $table->string('cin');
            $table->string('civilite');
            $table->string('nationalite');
            $table->string('adresse');
            $table->string('tele')->nullable();
            $table->string('ville')->nullable();
            $table->string('categorie')->nullable();
            $table->string('abreviation')->nullable();
            $table->string('type')->default('SC');
            $table->string('code_postal')->nullable();
            $table->string('logoSC')->nullable();
            $table->string('seince')->nullable();
            $table->string('montant_plafond')->nullable();
            $table->unsignedBigInteger('mod_id')->nullable();
            $table->foreign('mod_id')->references('id')->on('mode_paimants')->onDelete('cascade');
            $table->unsignedBigInteger('secteur_id')->nullable();
            $table->foreign('secteur_id')->references('id')->on('secteur_clients')->onDelete('cascade');
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade');
            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')->references('id')->on('regions')->onDelete('cascade');
            $table->unsignedBigInteger('client_id');
            $table->foreign('client_id')->references('id')->on('clients_particulier')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_clients_particulier');
    }
};
