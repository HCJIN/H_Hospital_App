package com.green.H_Hospital_App.location.util;

public class Haversine {
    private static final int EARTH_RADIUS = 6371; // 지구 반지름 (km)

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        System.out.println(lat1);
        System.out.println(lat2);
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c; // 결과는 킬로미터 단위
    }

    public static double calculateDistance() {
        double lat1 =35.542117;
        double lon1 =129.338326;
        double lat2 =35.539780;
        double lon2 =129.311694;

        System.out.println(lat1);
        System.out.println(lat2);
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c; // 결과는 킬로미터 단위
    }
}
