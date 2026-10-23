use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct Message {
    pub text: String,
}

pub fn process_message(text: &str) -> Message {
    Message {
        text: format!("Processed: {}", text),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_message() {
        let input = "hello";
        let expected = Message { text: "Processed: hello".to_string() };
        assert_eq!(process_message(input), expected);
    }
}
