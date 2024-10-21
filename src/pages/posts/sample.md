---
# layout: ../../layouts/PostLayout.astro
title: "Astro v1 Launch!"
author: "Matthew Phillips"
date: "09 Aug 2022"
---

# Hello World

This is a sample sentence.

<style>
nav {
    /* background-color: white; */
}
ul {
    display: flex;
    justify-content: space-between;
    padding: .5rem 3rem .5rem 3rem;
}
li {
    display: flex;
    flex-direction: column;
    color: yellow;
    text-shadow: 1px white;
    align-items: center;
    position: relative;
}
li:hover {
    color: white;
    text-shadow: 1px white;
}
li::after {
    content: "";
    margin-top: .1rem;
    background-color: yellow;
    display: block;
    border: 1px solid yellow;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

li:hover::after {
    opacity: 1;
}
</style>


