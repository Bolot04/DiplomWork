package model

type Holiday struct {
	ID          uint   `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Description string `json:"description" db:"description"`
	Date        string `json:"date" db:"holiday_date"`
	ImageURL    string `json:"image_url" db:"image_url"`
}