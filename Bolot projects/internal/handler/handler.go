package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"holiday-platform/internal/model"
	"holiday-platform/internal/service"

)

type Handler struct {
	HolidayServices *service.HolidayService
	SongServices    *service.SongService
	DanceServices   *service.DanceService
}

func NewHandler(HolidayService *service.HolidayService, SongServices *service.SongService, DanceServices *service.DanceService) *Handler {
	return &Handler{HolidayServices: HolidayService, SongServices: SongServices, DanceServices: DanceServices}
}

func (a *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.Static("/uploads", "./uploads")

	api := router.Group("/api")
	{
		// Эндпоинт авторизации
		api.POST("/admin", a.AdminLogin)

		// Публичные GET маршруты
		holidays := api.Group("/holidays")
		{
			holidays.GET("/", a.GetAllHolidays)
			holidays.GET("/:id", a.GetByIdHoliday)
			holidays.GET("/:id/songs", a.GetAllSongsByHolidayId)
			holidays.GET("/:id/dances", a.GetAllDancesByHolidayId)
		}

		songs := api.Group("/songs")
		{
			songs.GET("/:id", a.GetByIDSong)
		}

		dances := api.Group("/dances")
		{
			dances.GET("/:id", a.GetByIdDance)
		}

		// Защищённые маршруты — только для админа
		admin := api.Group("/")
		admin.Use(AdminMiddleware())
		{
			admin.POST("/upload", a.UploadFile)

			admin.POST("/holidays/", a.CreateHoliday)
			admin.DELETE("/holidays/:id", a.DeleteHoliday)

			admin.POST("/songs/", a.CreateSong)
			admin.DELETE("/songs/:id", a.DeleteSong)

			admin.POST("/dances/", a.CreateDance)
			admin.DELETE("/dances/:id", a.DeleteDance)
		}
	}

	return router
}

// --- Holiday handlers ---

func (a *Handler) GetAllHolidays(c *gin.Context) {
	holidays, err := a.HolidayServices.GetAll()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"Holidays": holidays})
}

func (a *Handler) CreateHoliday(c *gin.Context) {
	var holiday model.Holiday
	if err := c.ShouldBindBodyWithJSON(&holiday); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := a.HolidayServices.Create(holiday)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "created", "id": id})
}

func (a *Handler) DeleteHoliday(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	_, err = a.HolidayServices.Delete(model.Holiday{ID: uint(id)})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func (a *Handler) GetByIdHoliday(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	holiday, err := a.HolidayServices.GetById(uint(id))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "found", "holiday": holiday})
}

func (a *Handler) GetAllSongsByHolidayId(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	songs, err := a.SongServices.GetByHolidayId(uint(id))
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "found", "songs": songs})
}

func (a *Handler) GetAllDancesByHolidayId(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	dances, err := a.DanceServices.GetByHolidayId(uint(id))
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "found", "dances": dances})
}

// --- Song handlers ---

func (a *Handler) CreateSong(c *gin.Context) {
	var song model.Song
	if err := c.ShouldBindBodyWithJSON(&song); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := a.SongServices.Create(song)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "created", "id": id})
}

func (a *Handler) GetByIDSong(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	song, err := a.SongServices.GetById(uint(id))
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "found", "song": song})
}

func (a *Handler) DeleteSong(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	_, err = a.SongServices.Delete(model.Song{ID: uint(id)})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

// --- Dance handlers ---

func (a *Handler) CreateDance(c *gin.Context) {
	var dance model.Dance
	if err := c.ShouldBindBodyWithJSON(&dance); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := a.DanceServices.Create(dance)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "created", "id": id})
}

func (a *Handler) GetByIdDance(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	dance, err := a.DanceServices.GetById(uint(id))
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "found", "dance": dance})
}

func (a *Handler) DeleteDance(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	_, err = a.DanceServices.Delete(model.Dance{ID: uint(id)})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}