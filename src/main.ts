/*Description
We're going to improve yesterday's app by adding more functionality to it! 
Take a look at the template in the instructions. Notice the changes in index.html? Use the added code inside the article to finish the task:

Instructions
- Use the provided template as a refereece. Again, Work with your yesterday's code.: https://codesandbox.io/s/hoxtagram-ii-crud-template-j5t72p?file=/index.html
- Have the like button adding 1 like to the respective counter each time you click it
- Have the comments form to add another comment to the respective post
- Add a delete button to each comment and post. Setup these buttons to be able to delete respectively comments and posts, and persist the changes.
- The data must be persisted in the server so that when you refresh the page it doesn't go away

Tips
- Try to think which kind of HTTP method you should use on each occasion
- Use function scopes to your advantage
*/

type CommentData = {
    id: number
    content : string
    imageId : string
} 

type Image = {
    id: number | undefined
    title: string
    likes: number | undefined
    image: string
    comments : CommentData[]
}

type State = {
    images: Image[]
}


let state : State = {
    images: []
}

function getDataFromServer() {
    fetch('http://localhost:5000/images')
    .then(resp => resp.json())
    .then(serverData => { 
        state.images = serverData 
    render()
})
}

function render() {
    let imageContainer = document.querySelector<HTMLElement>('.image-container')
  if (imageContainer === null) return
  imageContainer.textContent = ''

  for (let image of state.images) {
    let articleEl = document.createElement('article')
    articleEl.className = 'image-card'

    let titleEl = document.createElement('h2')
    titleEl.className = 'title'
    titleEl.textContent = image.title
    let postDeleteBtn = document.createElement('button')
    postDeleteBtn.textContent = 'Delete Post'
    postDeleteBtn.className = 'comment-button'

    postDeleteBtn.addEventListener('click' , function () {
        
        deletePost(image)
        deletePostInServer(image)
        articleEl.textContent = ""
        render()
    })

    titleEl.appendChild(postDeleteBtn)

    let imgEl = document.createElement('img')
    imgEl.className = 'image'
    imgEl.src = image.image

    let likesSection = document.createElement('div')
    likesSection.className = 'likes-section'

    let likesSpan = document.createElement('span')
    likesSpan.className = 'likes'
    likesSpan.textContent = `${image.likes} likes`

    let likeBtn = document.createElement('button')
    likeBtn.className = 'like-button'
    likeBtn.textContent = '♥'
    likeBtn.addEventListener('click', function () {
        if (!image.likes) return
        image.likes++
        updateDataInServer(image)
        render()
      })
  
      let commentsUl = document.createElement('ul')
      commentsUl.className = 'comments'
  
      for (let comment of image.comments) {
        let commentLi = document.createElement('li')
        commentLi.textContent = comment.content
        let commentBtn = document.createElement('button')
        commentBtn.textContent = 'Delete'
        commentBtn.className = 'comment-button'
        commentBtn.addEventListener('click', function () {
            comment.content = ''

            deleteCommentInServer(comment)
            render()
        })
        commentLi.appendChild(commentBtn)

        commentsUl.append(commentLi)
      }
      /*<form class="comment-form">
          <input
            class="comment-input"
            type="text"
            name="comment"
            placeholder="Add a comment..."
          />
          <button class="comment-button" type="submit">Post</button>
        </form>*/

      let formEl = document.createElement('form')  
      formEl.className = 'comment-form'

      let formInput = document.createElement('input')
      formInput.className = 'comment-input'
      formInput.type = 'text'
      formInput.name = 'comment'
      formInput.placeholder = 'Add a comment...'

      let formBtn = document.createElement('button')
      formBtn.className = "comment-button"
      formBtn.type = 'submit'
      formBtn.textContent = 'Post'

      formEl.addEventListener("submit", function (event) {
        event.preventDefault()
        
        //image.comments[].content.push(formInput.value)
        createCommentsInServer(image , formInput)
       
      })

      formEl.append(formInput , formBtn)
      likesSection.append(likesSpan, likeBtn)
      articleEl.append(titleEl, imgEl, likesSection, commentsUl, formEl)
  
      imageContainer.append(articleEl)
    }
  }


function updateDataInServer(item : Image) {
    fetch(`http://localhost:5000/images/${item.id}` , {
        method : 'PATCH',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(item)
    }).then(resp => resp.json())
    
}

function createCommentsInServer(item :Image , input : HTMLInputElement) {
    fetch(`http://localhost:5000/comments`, {
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify({
            content : input.value,
            imageId : item.id
        })
    }).then(resp => resp.json())
    .then(function (newComment : CommentData) {
        item.comments.push(newComment)
        render()
    })
}


function deleteCommentInServer(item : CommentData) {
fetch(`http://localhost:5000/comments/${item.id}`, {
    method: "DELETE",
})
    .then(resp => resp.json())
    render()
}


function deletePostInServer(item : Image) {
    fetch(`http://localhost:5000/images/${item.id}`, {
        method: "DELETE",
    })
        .then(resp => resp.json())
        render()
    }


function deletePost(item : Image) {

}
    


getDataFromServer()
render()


