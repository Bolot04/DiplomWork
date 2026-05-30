package service

import (
	"fmt"

	"holiday-platform/internal/model"
	"holiday-platform/internal/repository"
)

type DanceService struct {
	repo repository.DanceRepository
}

func NewDanceService(repository repository.DanceRepository) *DanceService{
	return &DanceService{repo: repository}
}

func (a *DanceService) Create(dance model.Dance) (int, error){
	if dance.Title == ""{
		return 0, fmt.Errorf("Dance title can't be empty")
	}
	id, err := a.repo.Create(dance)
	if err != nil{
		return 0, fmt.Errorf("Problem to create dance: %w", err)
	}

	return id, err
}

func (a *DanceService) GetById(id uint) (model.Dance, error){
	dance, err := a.repo.GetById(id)
	if err != nil{
			return model.Dance{}, fmt.Errorf("Can't get by id: %w", err)		
	}

	return dance, err	
}

func (a *DanceService) GetByHolidayId(id uint) ([]model.Dance, error){
	dances, err := a.repo.GetByHolidayId(id)
	if err != nil{
		return nil, fmt.Errorf("Can't get holiday_id: %w", err)
	}

	return dances, err
}

func (a *DanceService) Delete(d model.Dance) (string, error) {
	return a.repo.Delete(d)
}