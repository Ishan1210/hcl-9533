package com.borrowbuddy.util;
public class DistanceUtil {
 public static double calculateDistance(double lat1,double lon1,double lat2,double lon2){
 double a=Math.pow(Math.sin(Math.toRadians(lat2-lat1)/2),2)+Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))*Math.pow(Math.sin(Math.toRadians(lon2-lon1)/2),2);
 a=Math.max(0,Math.min(1,a)); return 6371.0*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
 }
}
