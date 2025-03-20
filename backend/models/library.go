package models

import (
	"github.com/google/uuid"
)

type Library struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title    string    `gorm:"not null" json:"title"`
	Image    string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"image"`
	Focus    string    `gorm:"type:varchar(50);not null" json:"focus"`
	Category string    `gorm:"type:varchar(30);not null" json:"category"`
	Content  string    `gorm:"not null" json:"content"`
	Date     string    `gorm:"type:date;not null" json:"date"`
	Source   string    `gorm:"not null" json:"source"`
	User     []User    `gorm:"many2many:publish" json:"user"`
}

func (Library) TableName() string {
	return "library"
}
