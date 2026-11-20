use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RequestConfig {
    pub url: String,
    pub method: String,
}

pub fn validate_url(url: &str) -> Result<(), String> {
    if url.trim().is_empty() {
        return Err("URL cannot be empty".to_string());
    }
    if !url.starts_with("http://") && !url.starts_with("https://") {
        return Err("URL must start with http:// or https://".to_string());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_url_valid() {
        assert!(validate_url("https://google.com").is_ok());
        assert!(validate_url("http://localhost:8080").is_ok());
    }

    #[test]
    fn test_validate_url_invalid_empty() {
        let result = validate_url("   ");
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "URL cannot be empty");
    }

    #[test]
    fn test_validate_url_invalid_protocol() {
        let result = validate_url("ftp://files.com");
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "URL must start with http:// or https://");
    }
}
