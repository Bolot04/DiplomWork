package server

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

type Server struct {
	*http.Server
}

func New(port string, handler http.Handler) *Server {
	return &Server{
		&http.Server{
			Addr: ":" + port,
			Handler: handler,
			ReadTimeout:    5 * time.Second,
			WriteTimeout:   10 * time.Second,
			MaxHeaderBytes: 32 << 20, // 20MB
		},
	}
}

func (a *Server) Run() error {
	log.Println("[SERVER] starting...")
	err := a.ListenAndServe()
	if err != nil{
		return fmt.Errorf("Can't run server: %w", err)
	}

	return nil
}

func (a *Server) Shutdown() error {
	err := a.Close()
	if err != nil {
		return fmt.Errorf("Can't shutdown server: %w", err)
	}

	log.Println("[SERVER] STOPPED")
	return nil
}
