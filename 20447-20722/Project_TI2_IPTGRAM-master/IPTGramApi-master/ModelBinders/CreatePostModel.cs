using IPTGram.Data;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IPTGram.ModelBinders
{
    //cria um post
    public class CreatePostModel : IValidatableObject
    {
     
        [Required]
        public string Metadata { get; set; }

        [Required]
        public IFormFile Image { get; set; }


        //este metodo é chamado pelo MVC
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //validar a imagem(jpgs apenas)
            if (Image.ContentType != "image/jpeg" && Image.ContentType != "image/jpg")
            {
                yield return new ValidationResult("A imagem tem que ser em JPG.", new[] { "ImageContentType"});

            }
         
        }
    }
}
