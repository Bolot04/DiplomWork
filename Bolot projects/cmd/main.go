package main

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	server "holiday-platform"
	"holiday-platform/internal/handler"
	"holiday-platform/internal/repository"
	"holiday-platform/internal/service"
)

var (
	host = os.Getenv("DB_HOST")
	port = os.Getenv("DB_PORT")
	user     = ""
	password = ""
	dbname   = ""
)




func main() {
	godotenv.Load()
	host = os.Getenv("DB_HOST")
	port = os.Getenv("DB_PORT")
	user = os.Getenv("POSTGRES_USER")
	password = os.Getenv("POSTGRES_PASSWORD")
	dbname = os.Getenv("POSTGRES_DB")

	fmt.Println("DB:", host, port)




	portINT, err := strconv.Atoi(port)
	if err != nil {
		panic(err)
	}
	
	// Конфиг для Postgres
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, portINT, user, password, dbname)

	
	// Подключение к DB
	db, err := sql.Open("postgres", psqlInfo)

	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err!= nil {
		panic(err)
	}

	fmt.Println("[STATUS] SUCCESFULLY CONECTED")

	// Инициализация репозитория
	Holidayrepo := repository.NewHolidayRepo(db)
	HolidayService := service.NewHolidayService(Holidayrepo)
	// song services
	Songrepo := repository.NewSongRepo(db)
	SongService := service.NewSongService(Songrepo)
	// dance services
	Dancerepo := repository.NewDanceRepo(db)
	DanceService := service.NewDanceService(Dancerepo)
	fmt.Println("Service initialized successfully")

	// Инициализация Handler и роутов
	Handler := handler.NewHandler(HolidayService, SongService, DanceService)

	// Запуск сервера
	router := Handler.InitRoutes()
	server := server.New("8081"/* Указываем тута порт сервера. Хост настраивается в server.go */, router)
	err = server.Run()
	if err != nil{
		panic(err)
	}
	
}
