package models

import (
	"time"

	"github.com/google/uuid"
)

type Trash struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Type           string    `gorm:"type:varchar(50);not null" json:"type"`
	Image          string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"image"`
	Recommendation string    `gorm:"not null" json:"recommendation"`
	Time           time.Time `gorm:"autoCreateTime;not null" json:"time"`
	UserID         string    `gorm:"type:varchar(255);not null" json:"user_id"`
}

func (Trash) TableName() string {
	return "trash"
}
