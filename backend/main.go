package main

import (
	"GreenSortAI/config"
	"GreenSortAI/routes"
)

func main() {
	config.InitConfig()
	config.InitDB()

	r := routes.SetupRouter()
	r.Run(":8080")
}
