const generateButton = document.getElementById("generate");
const prompt = document.getElementById("prompt");
let images = document.getElementsByClassName("image");
const numbutton = document.getElementsByClassName("resolution");
const backBtn = document.getElementsByClassName("backBtn")[0];
const apiSelector = document.getElementById("api-selector");

let currentStyle = "";
let total_images = 1;
let apiType = 'rapidapi'; // Default API type

// Update selected API type
apiSelector.addEventListener('change', (event) => {
    apiType = event.target.value;
});

for (let index = 0; index < numbutton.length; index++) {
    numbutton[index].addEventListener("click", () => {
        updateImageCount(Number(numbutton[index].innerText));
    });
}

function updateImageCount(imageCount) {
    total_images = imageCount;
    for (let index = 0; index < numbutton.length; index++) {
        numbutton[index].classList.remove("active");
    }
    numbutton[imageCount - 1].classList.add("active");
}

async function generateImage(prompt) {
    document.querySelector(".settings").classList.add("hidden");
    document.querySelector(".stylesContainer").style.display = "none";
    document.querySelector(".output").classList.remove("hidden");
    backBtn.classList.remove("hidden");
    const container = document.querySelector('.output');
    let count = 0;
    let array = document.getElementsByClassName("video");
    for (let index = 0; index < array.length; index++) {
        array[index].classList.remove("hidden");
        images[index].style.background = "#eee4fe";
    }
    container.innerHTML = "";

    for (let index = 0; index < total_images; index++) {
        let imageDiv = document.createElement("div");
        imageDiv.classList.add("image");
        const video = document.createElement("video");
        video.setAttribute("src", "./light.mp4");
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.setAttribute("width", "18");
        video.setAttribute("height", "20");
        video.classList.add("video");
        imageDiv.appendChild(video);
        container.append(imageDiv);
    }

    const cards = container.querySelectorAll('.image');
    const containerWidth = container.clientWidth;
    const numCards = total_images;
    let cardSize = containerWidth / numCards - 32; // 32px accounts for the gap and padding
    if (numCards < 2) {
        container.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    } else {
        container.style.gridTemplateColumns = "1fr 1fr";
    }
    if (cardSize < 185) {
        cardSize = 185;
    }
    cardSize = Math.max(cardSize, 185);
    cards.forEach(card => {
        card.style.width = `${cardSize*1.285}px`;
        card.style.height = `${cardSize}px`;
    });

    while (count < total_images) {
        try {
            const imageUrl = await fetchImage(prompt, currentStyle);
            array[count].classList.add("hidden");
            console.log(imageUrl)
            images[count].style.background = `url(${imageUrl})`;
            images[count].style.backgroundSize = "cover";
        } catch (error) {
            console.error('Error:', error);
        }
        count++;
    }
}

// Fetch image based on selected API
async function fetchImage(prompt, style) {
    if (apiType === 'rapidapi') {
        return await fetchRapidAPIImage(prompt, style);
    } else if (apiType === 'huggingface') {
        return await fetchHuggingFaceImage(prompt, style);
    }
}

// Fetch image using RapidAPI
async function fetchRapidAPIImage(prompt, style) {
    const url = 'https://animimagine-ai.p.rapidapi.com/generateImage';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '19642c560bmsh15af0b894fd3539p1d0719jsn5459220ad575',
            'x-rapidapi-host': 'animimagine-ai.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: style + prompt
        })
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result.imageUrl;
}

// Fetch image using Hugging Face API
// Fetch image using Hugging Face API
async function fetchHuggingFaceImage(prompt, style) {
    const url = 'https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora';
    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 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', // Replace with your Hugging Face API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: style + prompt,
            "properties": {
                "width":  1152,
                "height": 896
            },
                "options":{
                    use_cache: false
                }
            
        })
    };
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if response is JSON or binary
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        throw new Error(`Error from Hugging Face API: ${result.error || 'Unknown error'}`);
    } else {
        const blob = await response.blob(); // Convert the binary data to a Blob
        return URL.createObjectURL(blob); // Create a URL for the Blob
    }
}


generateButton.addEventListener("click", () => {
    if (prompt.value != "") {
        generateImage(prompt.value);
    } else {
        alert("The prompt should not be empty");
    }
});

const imageGenerationPrompts = [
    {
        style: "Photographic",
        prompt: "Create a highly detailed, realistic photographic image with lifelike colors and textures. Focus on capturing intricate details and natural lighting."
    },
    {
        style: "Anime",
        prompt: "Generate a vibrant and dynamic anime-style image with exaggerated features and bright, bold colors. Emphasize expressive characters and dramatic effects."
    },
    {
        style: "Fantasy Art",
        prompt: "Design a fantastical fantasy art scene with magical creatures, enchanted landscapes, and otherworldly elements. Use rich, imaginative details and a mystical atmosphere."
    },
    {
        style: "Line Art",
        prompt: "Produce a clean, minimalistic line art drawing with clear outlines and simple shading. Focus on geometric shapes and fine details with no color."
    },
    {
        style: "3D Model",
        prompt: "Create a 3D model rendered image with realistic textures and lighting effects. Emphasize depth, shadow, and detail in a three-dimensional space."
    },
    {
        style: "Neopunk",
        prompt: "Generate a futuristic neopunk style image featuring high-tech and gritty urban elements. Use neon colors, cybernetic details, and a dystopian vibe."
    },
    {
        style: "Comic Book",
        prompt: "Create a comic book-style illustration with bold lines, dynamic poses, and vibrant colors. Incorporate speech bubbles and dramatic panel layouts."
    },
    {
        style: "Digital Art",
        prompt: "Design a modern digital art piece with a focus on innovative techniques, digital textures, and high-resolution details. Use a range of colors and abstract forms."
    },
    {
        style: "Cinematic",
        prompt: "Produce a cinematic-style image with a dramatic composition, high contrast, and movie-like lighting effects. Emphasize mood and depth with a film-like quality."
    },
    {
        style: "Low Poly",
        prompt: "Create a low poly 3D model style image with geometric shapes and flat colors. Focus on simplicity and stylized representations with minimal detail."
    },
    {
        style: "Isometric",
        prompt: "Generate an isometric-style image with a 3D effect but viewed from an angled top-down perspective. Use precise angles and a grid layout to enhance the effect."
    },
    {
        style: "Disney Pixar",
        prompt: "Highly detailed, A Disney Pixar animation of "
    }
];
const styles = document.getElementsByClassName("styles");
for (let index = 0; index < styles.length; index++) {
    styles[index].addEventListener("click", () => {
        updateStyle(styles[index].innerText);
    });
}

function findElementByText(text) {
    const elements = document.querySelectorAll('.styles');
    for (let el of elements) {
        if (el.innerText.trim() === text) {
            return el;
        }
    }
    return null;
}

function updateStyle(styleName) {
    const styleObject = imageGenerationPrompts.find(item => item.style === styleName);
    if (styleObject) {
        currentStyle = styleObject.prompt;
    } else {
        currentStyle = "";
    }
    for (let index = 0; index < styles.length; index++) {
        styles[index].classList.remove("active");
    }
    let activeStyle = findElementByText(styleName);
    activeStyle.classList.add("active");
}

backBtn.addEventListener("click", () => {
    backBtn.classList.add("hidden");
    document.querySelector(".settings").classList.remove("hidden");
    document.querySelector(".stylesContainer").style.display = "grid";
    document.querySelector(".output").classList.add("hidden");
});
