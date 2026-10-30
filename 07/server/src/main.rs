use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Message {
    text: String,
}

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello from Rust Server!")
}

#[post("/echo")]
async fn echo(msg: web::Json<Message>) -> impl Responder {
    HttpResponse::Ok().json(msg.into_inner())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at http://127.0.0.1:8080");
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
