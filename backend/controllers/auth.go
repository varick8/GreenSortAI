package controllers

import (
	"GreenSortAI/config"
	"GreenSortAI/services"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GoogleLoginHandler(c *gin.Context) {
	url := config.GoogleOauthConfig.AuthCodeURL("state-token")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallbackHandler(c *gin.Context) {
	code := c.Query("code")
	token, err := config.GoogleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to exchange token"})
		return
	}

	user, err := services.GetUserInfo(token.AccessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve user info"})
		return
	}

	signedToken, err := services.SignJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate JWT"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": signedToken,
	})
}
