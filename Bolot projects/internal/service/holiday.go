package service

import (
	"errors"
	"fmt"

	"holiday-platform/internal/model"
	"holiday-platform/internal/repository"
)

type HolidayService struct {
	repo repository.HolidayRepository
}

func NewHolidayService(repo repository.HolidayRepository) *HolidayService{
	return &HolidayService{repo: repo}
}

func (a *HolidayService) Create(h model.Holiday) (int, error){
	if h.Title == ""{
		return 0, errors.New("title can't be empty")
	}

	id, err := a.repo.Create(h)
	if err != nil{
		return 0, fmt.Errorf("Error Service: %w", err)
	}

	return id, err
}

func (a *HolidayService) GetAll() ([]model.Holiday, error){
	holidays, err := a.repo.GetAll()
	if err != nil{
		return nil, fmt.Errorf("Error getAll: %w", err)
	}

	return holidays, err
}

func (a *HolidayService) GetById(id uint) (model.Holiday, error){
	holiday, err := a.repo.GetById(id)
	if err != nil{
		return model.Holiday{}, fmt.Errorf("[ERROR]: %w", err)
	}

	return holiday, nil
}

func (a *HolidayService) Delete(h model.Holiday) (string, error) {
	return a.repo.Delete(h)
}