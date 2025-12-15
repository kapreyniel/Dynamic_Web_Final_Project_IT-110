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
            return $this->nasaService->getAstronomyPictureOfDay($count);
        });

        return response()->json($data);
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
