use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

pub enum ArticleInstruction {
    AddArticle {
        title: String,
        rating: u8,
        description: String,
    },
    UpdateArticle {
        title: String,
        rating: u8,
        description: String,
    },
    AddComment {
        comment: String,
    },
}

#[derive(BorshDeserialize)]
struct ArticleReviewPayload {
    title: String,
    rating: u8,
    description: String,
}

#[derive(BorshDeserialize)]
struct CommentPayload {
    comment: String,
}

impl ArticleInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match variant {
            0 => {
                let payload = ArticleReviewPayload::try_from_slice(rest).unwrap();
                Self::AddArticleReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }
            }
            1 => {
                let payload = ArticleReviewPayload::try_from_slice(rest).unwrap();
                Self::UpdateArticleReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }
            }
            2 => {
                let payload = CommentPayload::try_from_slice(rest).unwrap();
                Self::AddComment {
                    comment: payload.comment,
                }
            }
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
