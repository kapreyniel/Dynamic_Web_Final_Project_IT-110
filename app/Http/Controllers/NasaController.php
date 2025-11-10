<?php

namespace App\Http\Controllers;

use App\Services\NasaApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NasaController extends Controller
{
    protected $nasaService;

    public function __construct(NasaApiService $nasaService)
    {
        $this->nasaService = $nasaService;
    }

    /**
     * Get Astronomy Picture of the Day
     */
    public function getAstronomyPictureOfDay(Request $request)
    {
        $count = $request->query('count', 5);
        $cacheKey = "nasa_apod_{$count}";

        $data = Cache::remember($cacheKey, 3600, function () use ($count) {
            $apiData = $this->nasaService->getAstronomyPictureOfDay($count);
            
            // If API fails, return mock data
            if (empty($apiData)) {
                return $this->getMockApodData($count);
            }
            
            return $apiData;
        });

        return response()->json($data);
    }
    
    /**
     * Get mock APOD data for when API is unavailable
     */
    private function getMockApodData($count = 5)
    {
        $mockData = [
            [
                'title' => 'Nebula in Deep Space',
                'explanation' => 'A stunning view of a cosmic nebula captured by advanced telescopes, showcasing the birth of new stars.',
                'url' => 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200',
                'media_type' => 'image',
                'date' => '2024-11-01'
            ],
            [
                'title' => 'Galaxy Cluster',
                'explanation' => 'An incredible collection of galaxies spanning millions of light-years across the universe.',
                'url' => 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200',
                'media_type' => 'image',
                'date' => '2024-11-02'
            ],
            [
                'title' => 'Spiral Galaxy',
                'explanation' => 'A beautiful spiral galaxy with distinct arms of stars, gas, and dust.',
                'url' => 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200',
                'media_type' => 'image',
                'date' => '2024-11-03'
            ],
            [
                'title' => 'Star Formation Region',
                'explanation' => 'A region of active star formation where cosmic clouds collapse to create new stellar systems.',
                'url' => 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200',
                'media_type' => 'image',
                'date' => '2024-11-04'
            ],
            [
                'title' => 'Cosmic Pillars',
                'explanation' => 'Towering pillars of gas and dust in a star-forming region of space.',
                'url' => 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200',
                'media_type' => 'image',
                'date' => '2024-11-05'
            ],
        ];
        
        return array_slice($mockData, 0, $count);
    }

    /**
     * Get EPIC (Earth Polychromatic Imaging Camera) images
     */
    public function getEpicImages()
    {
        $cacheKey = 'nasa_epic_latest';

        $data = Cache::remember($cacheKey, 3600, function () {
            return $this->nasaService->getEpicImages();
        });

        return response()->json($data);
    }

    /**
     * Get Mars Rover Photos
     */
    public function getMarsPhotos(Request $request)
    {
        $sol = $request->query('sol', 1000);
        $cacheKey = "nasa_mars_photos_{$sol}";

        $data = Cache::remember($cacheKey, 3600, function () use ($sol) {
            return $this->nasaService->getMarsPhotos($sol);
        });

        return response()->json($data);
    }

    /**
     * Get Near Earth Objects
     */
    public function getNearEarthObjects(Request $request)
    {
        $startDate = $request->query('start_date', now()->format('Y-m-d'));
        $endDate = $request->query('end_date', now()->addDays(7)->format('Y-m-d'));
        $cacheKey = "nasa_neo_{$startDate}_{$endDate}";

        $data = Cache::remember($cacheKey, 3600, function () use ($startDate, $endDate) {
            return $this->nasaService->getNearEarthObjects($startDate, $endDate);
        });

        return response()->json($data);
    }
}
