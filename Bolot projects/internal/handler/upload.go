package handler

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func (a *Handler) UploadFile(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file"})
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".mp3": true, ".mp4": true, ".wav": true}
	if !allowed[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "недопустимый тип файла"})
		return
	}

	os.MkdirAll("./uploads", 0755)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	dst, err := os.Create("./uploads/" + filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось сохранить файл"})
		return
	}
	defer dst.Close()
	io.Copy(dst, file)

	c.JSON(http.StatusOK, gin.H{"url": "/uploads/" + filename})
}