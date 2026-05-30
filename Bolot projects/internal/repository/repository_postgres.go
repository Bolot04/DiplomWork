package repository

import (
	"database/sql"
	"fmt"

	"holiday-platform/internal/model"
)

type HolidayRepo struct {
	db *sql.DB
}

func NewHolidayRepo(db *sql.DB) *HolidayRepo {
	return &HolidayRepo{db: db}
}

func (a *HolidayRepo) Create(holiday model.Holiday) (int, error) {
	var id uint

	err := a.db.QueryRow("INSERT INTO holidays (title, description, holiday_date, image_url) VALUES ($1, $2, $3, $4) RETURNING id", holiday.Title, holiday.Description, holiday.Date, holiday.ImageURL).Scan(&id)
	if err != nil{
		return 0, fmt.Errorf("Can't create holiday: %w", err)
	}

	return int(id), nil
}

func (a *HolidayRepo) GetAll() ([]model.Holiday, error) {
    var holidays []model.Holiday

    rows, err := a.db.Query("SELECT id, title, description, holiday_date, image_url FROM holidays")
    if err != nil {
        return nil, fmt.Errorf("can't get all holidays: %w", err)
    }
    defer rows.Close()

    for rows.Next() {
        var h model.Holiday
        if err := rows.Scan(&h.ID, &h.Title, &h.Description, &h.Date, &h.ImageURL); err != nil {
            return nil, fmt.Errorf("scan error: %w", err)
        }
        holidays = append(holidays, h)
    }

    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("rows iteration error: %w", err)
    }

    return holidays, nil
}

func (a *HolidayRepo) GetById(id uint) (model.Holiday, error){
    var holiday model.Holiday

    err := a.db.QueryRow("SELECT id, title, description, holiday_date, image_url FROM holidays WHERE id = $1", id).Scan(&holiday.ID, &holiday.Title, &holiday.Description, &holiday.Date, &holiday.ImageURL)
    if err != nil{
        return model.Holiday{}, fmt.Errorf("Can't get holiday by id: %w", err)
    } else if err == sql.ErrNoRows{
        return model.Holiday{}, fmt.Errorf("No holiday with this id")
    }

    return holiday, nil
}

func (a *HolidayRepo) Delete(holiday model.Holiday) (string, error) {
	_, err := a.db.Exec("DELETE FROM holidays WHERE id = $1", holiday.ID)
	if err != nil {
		return "", fmt.Errorf("can't delete holiday: %w", err)
	}
	return "deleted", nil
}


type SongRepo struct{
    db *sql.DB
}

func NewSongRepo(db *sql.DB) *SongRepo{
    return &SongRepo{db: db}
}

func (a *SongRepo) Create(song model.Song) (int, error){
    var id uint

    err := a.db.QueryRow("INSERT INTO songs (holiday_id, title, lyrics, video_url) VALUES ($1, $2, $3, $4) RETURNING id", song.Holiday_id, song.Title, song.Lyrics, song.VideoURL).Scan(&id)
    if err != nil{
        return 0, fmt.Errorf("Can't create song: %w", err) 
    }

    return int(id), nil
}

func (a *SongRepo) GetById(id uint) (model.Song, error){
    var song model.Song

    err := a.db.QueryRow("SELECT id, holiday_id, title, lyrics, video_url FROM songs WHERE id = $1", id).Scan(
        &song.ID,
        &song.Holiday_id,
        &song.Title,
        &song.Lyrics,
        &song.VideoURL,
    )
    if err != nil{
        return model.Song{}, fmt.Errorf("Can't get song: %w", err)
    }

    return song, nil
}

func (a *SongRepo) GetByHolidayId(id uint) ([]model.Song, error){
    var songs []model.Song

    rows, err := a.db.Query("SELECT id, holiday_id, title, lyrics, video_url FROM songs WHERE holiday_id = $1", id)
    if err != nil{
        return []model.Song{}, fmt.Errorf("Can't get song: %w", err)
    }
    defer rows.Close()

    for rows.Next(){
        var song model.Song

        err := rows.Scan(
        &song.ID,
        &song.Holiday_id,
        &song.Title,
        &song.Lyrics,
        &song.VideoURL,
    )
        if err != nil{
            fmt.Println(err)
            continue
        }
        
        songs = append(songs, song)
        
    }
    
    if err := rows.Err(); err != nil{
        return nil, fmt.Errorf("Error GetByHoliday: %w", err)
    }

    return songs, nil
}

func (a *SongRepo) Delete(song model.Song) (string, error) {
	_, err := a.db.Exec("DELETE FROM songs WHERE id = $1", song.ID)
	if err != nil {
		return "", fmt.Errorf("can't delete song: %w", err)
	}
	return "deleted", nil
}

type DanceRepo struct{
    db *sql.DB
}

func NewDanceRepo(db *sql.DB) *DanceRepo{
    return &DanceRepo{db: db}
}

func (a *DanceRepo) Create(dance model.Dance) (int, error){
    var id uint

    err := a.db.QueryRow("INSERT INTO dances (holiday_id, title, description, video_url) VALUES ($1, $2, $3, $4) RETURNING id", dance.Holiday_id, dance.Title, dance.Description, dance.VideoURL).Scan(&id)
    if err != nil{
        return 0, fmt.Errorf("Can't create song: %w", err) 
    }

    return int(id), nil
}

func (a *DanceRepo) GetById(id uint) (model.Dance, error){
    var dance model.Dance

    err := a.db.QueryRow("SELECT id, holiday_id, title, description, video_url FROM dances WHERE id = $1", id).Scan(
        &dance.ID,
        &dance.Holiday_id,
        &dance.Title,
        &dance.Description,
        &dance.VideoURL,
    )
    if err != nil{
        return model.Dance{}, fmt.Errorf("Can't get dance: %w", err)
    }

    return dance, nil
}

func (a *DanceRepo) GetByHolidayId(id uint) ([]model.Dance, error){
    var dances []model.Dance

    rows, err := a.db.Query("SELECT id, holiday_id, title, description, video_url FROM dances WHERE holiday_id = $1", id)
    if err != nil{
        return []model.Dance{}, fmt.Errorf("Can't get dances: %w", err)
    }
    defer rows.Close()

    for rows.Next(){
        var dance model.Dance

        err := rows.Scan(
        &dance.ID,
        &dance.Holiday_id,
        &dance.Title,
        &dance.Description,
        &dance.VideoURL,
    )
        if err != nil{
            fmt.Println(err)
            continue
        }
        
        dances = append(dances, dance)
        
    }
    
    if err := rows.Err(); err != nil{
        return nil, fmt.Errorf("Error GetByHoliday: %w", err)
    }

    return dances, nil
}
func (a *DanceRepo) Delete(dance model.Dance) (string, error) {
	_, err := a.db.Exec("DELETE FROM dances WHERE id = $1", dance.ID)
	if err != nil {
		return "", fmt.Errorf("can't delete dance: %w", err)
	}
	return "deleted", nil
}