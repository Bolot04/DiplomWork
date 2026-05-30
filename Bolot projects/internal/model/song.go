package model

type Song struct {
	ID         uint   `json:"id" db:"id"`
	Holiday_id uint   `json:"holiday_id" db:"holiday_id"`
	Title      string `json:"title" db:"title"`
	Lyrics     string `json:"lyrics" db:"lyrics"`
	VideoURL   string `json:"video_url" db:"video_url"`
}