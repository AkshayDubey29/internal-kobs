package helloworld

import (
	"net/http"

	"github.com/kobsio/kobs/pkg/api/clusters"
	"github.com/kobsio/kobs/pkg/api/plugins/plugin"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/sirupsen/logrus"
)

// Route is the route under which the plugin should be registered in our router for the rest api.
const Route = "/helloworld"

var (
	log = logrus.WithFields(logrus.Fields{"package": "helloworld"})
)

// Config is the structure of the configuration for the resources plugin. It only contains one filed to forbid access to
// the provided resources.
type Config struct {
	Name           string `json:"name"`
	DisplayName    string `json:"displayName"`
	Description    string `json:"description"`
	HelloWorldName string `json:"helloWorldName"`
}

// Router implements the router for the resources plugin, which can be registered in the router for our rest api.
type Router struct {
	*chi.Mux
	clusters *clusters.Clusters
	config   Config
}

// getName returns the name form the configuration.
func (router *Router) getName(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Name string `json:"name"`
	}{
		router.config.HelloWorldName,
	}

	log.WithFields(logrus.Fields{"name": data.Name}).Tracef("getName")
	render.JSON(w, r, data)
}

// Register returns a new router which can be used in the router for the kobs rest api.
func Register(clusters *clusters.Clusters, plugins *plugin.Plugins, config Config) chi.Router {
	plugins.Append(plugin.Plugin{
		Name:        config.Name,
		DisplayName: config.DisplayName,
		Description: config.Description,
		Type:        "helloworld",
	})

	router := Router{
		chi.NewRouter(),
		clusters,
		config,
	}

	router.Get("/name", router.getName)

	return router
}
