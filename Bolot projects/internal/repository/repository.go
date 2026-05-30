package repository

import (
	"holiday-platform/internal/model"

)

type HolidayRepository interface {
	Create(holiday model.Holiday) (int, error)
	GetAll() ([]model.Holiday, error)
	GetById(id uint) (model.Holiday, error)
	Delete(holiday model.Holiday) (string, error)
}

type SongRepository interface{
	Create(song model.Song) (int, error)
	GetById(id uint) (model.Song, error)
	GetByHolidayId(id uint) ([]model.Song, error)
	Delete(song model.Song) (string, error)
}

type DanceRepository interface{
	Create(dance model.Dance) (int, error)
	GetById(id uint) (model.Dance, error)
	GetByHolidayId(id uint) ([]model.Dance, error)
	Delete(dance model.Dance) (string, error)
}
