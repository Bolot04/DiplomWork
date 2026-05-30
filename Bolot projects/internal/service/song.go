package service

import (
	"fmt"

	"holiday-platform/internal/model"
	"holiday-platform/internal/repository"
)

type SongService struct {
	repo repository.SongRepository
}

func NewSongService(repository repository.SongRepository) *SongService{
	return &SongService{repo: repository}
}

func (a *SongService) Create(song model.Song) (int, error){
	if song.Title == ""{
		return 0, fmt.Errorf("Song title can't be empty")
	}
	id, err := a.repo.Create(song)
	if err != nil{
		return 0, fmt.Errorf("Problem to create song: %w", err)
	}

	return id, err
}

func (a *SongService) GetById(id uint) (model.Song, error){
	song, err := a.repo.GetById(id)
	if err != nil{
			return model.Song{}, fmt.Errorf("Can't get by id: %w", err)		
	}

	return song, err	
}

func (a *SongService) GetByHolidayId(id uint) ([]model.Song, error){
	songs, err := a.repo.GetByHolidayId(id)
	if err != nil{
		return nil, fmt.Errorf("Can't get holiday_id: %w", err)
	}

	return songs, err
}

func (a *SongService) Delete(s model.Song) (string, error) {
	return a.repo.Delete(s)
}