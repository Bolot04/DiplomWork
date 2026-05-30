package model

type Dance struct {
	ID          uint   `json:"id" db:"id"`
	Holiday_id  uint   `json:"holiday_id" db:"holiday_id"`
	Title       string `json:"title" db:"title"`
	Description string `json:"description" db:"description"`
	VideoURL    string `json:"video_url" db:"video_url"`
}