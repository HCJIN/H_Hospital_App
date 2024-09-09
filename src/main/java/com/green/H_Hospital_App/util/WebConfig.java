package com.green.H_Hospital_App.util;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 CORS 설정
<<<<<<< HEAD
                .allowedOrigins("http://localhost:8081")  // 허용할 출처
=======
                .allowedOrigins("https://ab7a-58-151-101-222.ngrok-free.app", "https://gendhne-hcjin-8081.exp.direct")  // 허용할 출처
>>>>>>> hcj
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메서드
                .allowedHeaders("*")  // 허용할 헤더
                .allowCredentials(true)  // 쿠키 허용 여부
                .maxAge(3600);  // 캐시 지속 시간
    }
}
