const QuestionBank = [
  {
    question:"Q1. What metal is traditionally used in South Indian wedding jewelry?",
    a:"a) Silver",
    b:"b) Platinum",
    c:"c) Gold",
    d:"d) Brass",
    correct:"c",
  },
   {
    question:"Q2. What does the Thali or Mangalsutra symbolize?",
    a:"a) Wealth",
    b:"b) Marriage bond",
    c:"c) Fashion",
    d:"d) Status",
    correct:"b",
  },
   {
    question:"Q3. Temple jewelry designs are inspired by?",
    a:"a) Modern art",
    b:"b) Nature",
    c:"c) Gods and temples",
    d:"d) Western fashion",
    correct:"c",
  },
   {
    question:"Q4. Which jewelry piece is commonly worn on the waist by South Indian brides?",
    a:"a) Necklace",
    b:"b) Armlet",
    c:"c) Anklet",
    d:"d) Oddiyanam",
    correct:"d",
  },
   {
    question:"Q5. What is the traditional name for bridal earrings in South India?",
    a:"a) Studs",
    b:"b) Jhumka",
    c:"c) Jimikki Kammal",
    d:"d) Hoops",
    correct:"c",
  },
   {
    question:"Q6. Which gold purity is most commonly used for wedding jewelry in India?",
    a:"a) 18K",
    b:"b) 20K",
    c:"c) 22K",
    d:"d) 24K",
    correct:"c",
  },
   {
    question:"Q7. What is the purpose of wearing Metti (toe rings)?",
    a:"a) Decoration",
    b:"b) Religious ritual",
    c:"c) Symbol of marriage",
    d:"d) Fashion trend",
    correct:"c",
  },
   {
    question:"Q8. Which ornament is worn on the arm above the elbow?",
    a:"a) Bangle",
    b:"b) Vanki",
    c:"c) Kada",
    d:"d) Bracelet",
    correct:"b",
  },
   {
    question:"Q9. What is Kasulaperu?",
    a:"a) Waist belt",
    b:"b) Chain of gold coinss necklace",
    c:"c) Anklet",
    d:"d) Crown",
    correct:"b",
  },
   {
    question:"Q10. Why is gold considered important in Indian weddings?",
    a:"a) Easy to sell",
    b:"b) Status symbol",
    c:"c) Tradition and prosperity",
    d:"d) Lightweight",
    correct:"c",
  },
];

let currentQuestion = 0;
let answered = false;
let marks = 0;

const questionEle = document.querySelector(".question");
const optionA = document.getElementById("a");
const optionB = document.getElementById("b");
const optionC = document.getElementById("c");
const optionD = document.getElementById("d");
const next = document.querySelector(".next_btn");
const selectOption = document.querySelector(".check_option");
const score = document.querySelector(".show_score");
const options = document.querySelectorAll(".answer_box button:not(.next_btn)");

selectOption.style.display = "none";
score.style.display = "none";

function showQuestion() {
    let q = QuestionBank[currentQuestion];
    questionEle.innerText = q.question;
    optionA.innerText = q.a;
    optionB.innerText = q.b;
    optionC.innerText = q.c;
    optionD.innerText = q.d;
}

showQuestion();

next.addEventListener("click", () => {
    if (!answered) {
        selectOption.style.display = "block";
        return;
    }

    if (next.innerText === "Submit") {
        score.style.display = "block";
        if (marks >= 8) {
            const finalCoupon = generateSajCoupon();
            score.innerHTML = `Congratulations 🥳 you got ${marks}/10.<br>Your Premium Coupon: <strong>${finalCoupon}</strong>`;
            localStorage.setItem("quizCoupon", finalCoupon);
            localStorage.setItem("quizDiscount", "10");
        } else if (marks >= 5) {
            const finalCouponLow = generateSajCoupon2();
            score.innerHTML = `Keep it up 👍, you got ${marks}/10.<br>Your Coupon: <strong>${finalCouponLow}</strong>`;
            localStorage.setItem("quizCoupon2", finalCouponLow);
            localStorage.setItem("quizDiscount2", "5");
        } else {
            score.innerText = `You failed 😞, ${marks}/10. `;
        }
        next.disabled = true;
        return;
    }

    if (currentQuestion < QuestionBank.length - 1) {
        currentQuestion++;
        options.forEach(btn => {
            btn.classList.remove("green", "red");
            btn.disabled = false;
        });

        answered = false;
        selectOption.style.display = "none";
        showQuestion();
    }

    if (currentQuestion === QuestionBank.length - 1) {
        next.innerText = "Submit";
    }
});

options.forEach(option => {
    option.addEventListener("click", () => {
        answered = true;
        selectOption.style.display = "none";
        const selected = option.id;
        const correctOption = QuestionBank[currentQuestion].correct;

        if (selected === correctOption) {
            option.classList.add("green");
            marks++;
        } else {
            option.classList.add("red");
            document.getElementById(correctOption).classList.add("green");
        }
        options.forEach(btn => btn.disabled = true);
    });
});

function generateSajCoupon() {
    const prefix = "SAJ10";
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const randomLength = 8 - prefix.length;
    let randomPart = "";
    for (let i = 0; i < randomLength; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return prefix + randomPart;
}

function generateSajCoupon2() {
    const prefix = "SAJ05";
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const randomLength = 8 - prefix.length;
    let randomPart = "";
    for (let i = 0; i < randomLength; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return prefix + randomPart;
}