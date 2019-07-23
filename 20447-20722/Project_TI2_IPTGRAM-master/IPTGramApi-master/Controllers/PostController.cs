using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IPTGram.Data;
using IPTGram.ModelBinders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace IPTGram.Controllers
{
    //path para a API
    [Route("api/posts")]
    public class PostController : Controller
    {
        private readonly IPTGramDb db;                                  //Referência para a base de dados
        private readonly IHostingEnvironment hostingEnvironment;        //Referência para o scope

        public PostController(IPTGramDb context, IHostingEnvironment hostingEnvironment)
        {
            this.db = context;
            this.hostingEnvironment = hostingEnvironment;
        }

        //api posts
        //Trata o pedido para a obtenção da lista de Posts, que é filtrada através de uma query
        [HttpGet]
        public IActionResult GetPosts([FromQuery] string query)
        {
            //Se query for nula ou em branco pesquisa fica com os array com todos os Posts
            //Caso contrário é filtrada pela query
            IQueryable<Post> pesquisa = db.Posts;
            if (!string.IsNullOrWhiteSpace(query))
            {
                query = query.ToLower().Trim();
                pesquisa = pesquisa.Where(a => a.User.Name.ToLower().Trim().Contains(query) || a.Caption.ToLower().Trim().Contains(query));
            }

            //resultado devolve lista com varios detalhes dos posts
            var resultado = pesquisa
                .Select(a => new
                {
                    a.Id,
                    a.Caption,
                    a.PostedAt,
                    User = new
                    {
                        a.User.Id,
                        a.User.Name,
                        a.User.UserName,
                        a.User.IsDefault
                    },
                    likes = a.Likes.Count,
                    comments = a.Comments.Count
                })
                .ToList();

            return Ok(resultado);

        }


        //api/posts/{id}
        //Trata um pedido à API de um Post específico dado o seu ID
        [HttpGet("{id}")]
        public IActionResult getPost(int id)
        {
            try
            {
                var post = db.Posts
                    .Where(a => a.Id == id)
                    .Select(a => new
                    {
                        a.Id,
                        a.Caption,
                        a.PostedAt,
                        User = new
                        {
                            a.User.Id,
                            a.User.Name,
                            a.User.UserName,
                            a.User.IsDefault
                        },
                        Likes = a.Likes.Count,
                        Comments = a.Comments.Count
                    })
                    .Single();

                return Ok(post);

            }
            //try e catch usados caso o Single() dê excepção por não ser o único elemento
            catch (Exception)
            {
                return NotFound();
            }
        }

        //get /api/posts/{id}/image
        //Retorna uma imagem dado o ID do post
        [HttpGet("{id}/image")]
        public IActionResult getImagePost(int id)
        {
            try
            {
                //Variável que contém os detalhes da imagem
                var postImg = db.Posts
                     .Where(a => a.Id == id)
                     .Select(a => new
                     {
                         a.ImageFileName,
                         a.ImageContentType
                     })
                     .Single();

                var caminho = Path.Combine(hostingEnvironment.ContentRootPath, "images", postImg.ImageFileName);

                return PhysicalFile(caminho, postImg.ImageContentType);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        //get /api/posts/{id}/comments
        //Retorna comentários de um Post dado o ID do post
        [HttpGet("{id}/comments")]
        public IActionResult getComments(int id)
        {
            try
            {
                var postComment = db.Posts
                 .Where(a => a.Id == id)
                 .Select(a => new
                 {
                     Comments = a.Comments
                     .Select(m => new
                     {
                         m.Id,
                         m.Text,
                         m.PostedAt,

                         User = new
                         {
                             m.User.Id,
                             m.User.Name,
                             m.User.UserName,
                             m.User.IsDefault
                         },
                         Post = new
                         {
                             m.Id
                         }
                     })        
                 });
                return Ok(postComment);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

    }
}