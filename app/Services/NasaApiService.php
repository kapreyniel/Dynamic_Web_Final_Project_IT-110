<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NasaApiService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.nasa.api_key');
        $this->baseUrl = config('services.nasa.base_url');
    }

    /**
     * Get Astronomy Picture of the Day
     */
    public function getAstronomyPictureOfDay($count = 5)
    {
        try {
            $response = Http::timeout(10)
                ->withOptions(['verify' => false])
                ->get("{$this->baseUrl}/planetary/apod", [
                    'api_key' => $this->apiKey,
                    'count' => $count,
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('NASA APOD API Error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('NASA APOD API Exception', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get EPIC (Earth Polychromatic Imaging Camera) images
     */
    public function getEpicImages()
    {
        try {
            $response = Http::timeout(10)
                ->withOptions(['verify' => false])
                ->get("{$this->baseUrl}/EPIC/api/natural", [
                    'api_key' => $this->apiKey,
                ]);

            if ($response->successful()) {
                $images = $response->json();
                
                // Add full image URLs
                return array_map(function ($image) {
                    $date = date('Y/m/d', strtotime($image['date']));
                    $imageName = $image['image'];
                    $image['image_url'] = "https://epic.gsfc.nasa.gov/archive/natural/{$date}/png/{$imageName}.png";
                    return $image;
                }, array_slice($images, 0, 5));
            }

            Log::error('NASA EPIC API Error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('NASA EPIC API Exception', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get Mars Rover Photos
     */
    public function getMarsPhotos($sol = 1000)
    {
        try {
            $response = Http::timeout(10)
                ->withOptions(['verify' => false])
                ->get("{$this->baseUrl}/mars-photos/api/v1/rovers/curiosity/photos", [
                    'api_key' => $this->apiKey,
                    'sol' => $sol,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return array_slice($data['photos'] ?? [], 0, 12);
            }

            Log::error('NASA Mars Photos API Error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('NASA Mars Photos API Exception', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get Near Earth Objects
     */
    public function getNearEarthObjects($startDate, $endDate)
    {
        try {
            $response = Http::withOptions(['verify' => false])
                ->get("{$this->baseUrl}/neo/rest/v1/feed", [
                    'api_key' => $this->apiKey,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('NASA NEO API Error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('NASA NEO API Exception', ['error' => $e->getMessage()]);
            return [];
        }
    }
}
