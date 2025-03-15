package models

import (
	"time"
)

type User struct {
	ID         string    `gorm:"primarykey;type:varchar(255)" json:"id"`
	Email      string    `gorm:"uniqueIndex;type:varchar(100);not null" json:"email"`
	FirstName  string    `gorm:"type:varchar(50);not null" json:"first_name"`
	LastName   string    `gorm:"type:varchar(50);not null" json:"last_name"`
	PictureURL string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"picture_url"`
	Role       string    `gorm:"type:varchar(20);not null;default:'user'" json:"role"`
	CreatedAt  time.Time `gorm:"autoCreateTime;not null" json:"created_at"`
	Library    []Library `gorm:"many2many:publish" json:"library"`
	Trash      []Trash   `gorm:"foreignKey:UserID" json:"trash"`
}

func (User) TableName() string {
	return "user"
}
