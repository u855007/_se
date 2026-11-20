use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use server::{validate_url, RequestConfig};

#[derive(Serialize, Deserialize)]
struct ProxyResponse {
    status: u16,
    body: String,
}

#[post("/proxy")]
async fn proxy_request(req: web::Json<RequestConfig>) -> impl Responder {
    let target_url = &req.url;
    
    // 1. 執行單元測試邏輯：驗證 URL
    if let Err(e) = validate_url(target_url) {
        return HttpResponse::BadRequest().body(e);
    }

    // 2. 使用 reqwest 幫用戶發送請求
    let client = reqwest::Client::new();
    let res = match req.method.to_uppercase().as_str() {
        "GET" => client.get(target_url).send().await,
        "POST" => client.post(target_url).send().await,
        _ => return HttpResponse::BadRequest().body("Only GET and POST are supported"),
    };

    match res {
        Ok(response) => {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_else(|_| "Could not read response body".to_string());
            HttpResponse::Ok().json(ProxyResponse { status, body })
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Proxy Error: {}", e)),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("API Tester Server running at http://127.0.0.1:8080");

    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(proxy_request)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
