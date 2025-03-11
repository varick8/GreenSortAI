package models

import (
	"time"
)

type User struct {
	GoogleID   string    `gorm:"primarykey" json:"google_id"`
	Email      string    `gorm:"uniqueIndex" json:"email"`
	FirstName  string    `json:"first_name"`
	LastName   string    `json:"last_name"`
	PictureURL string    `json:"picture_url"`
	Phone      string    `json:"phone"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (User) TableName() string {
	return "user"
}
