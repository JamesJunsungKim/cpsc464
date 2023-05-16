import Head from 'next/head'
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import {TextareaAutosize} from '@mui/base';
import axios from "axios";
import {Post} from "../components/common";
import {Icon} from "@mui/material";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [state, setState] = useState({
        postText: '',
        posts: []
    })

    useEffect(() => {
        fetchPosts()

    }, [])

    const fetchPosts = () => {
        axios.get('http://localhost:9876/posts')
            .then((response) => {
                const postJsons = response.data.posts
                if (postJsons) {
                    const posts = postJsons.map((e) => {
                        return new Post(e.id, e.text, e.created_at)
                    })
                    setState({...state, posts: posts})
                }

            }).catch((e) => {
            console.log(e)
        })
    }

    const didClickOnPostButton = () => {
        if (state.postText.length == 0) {
            return
        }

        const data = {
            text: state.postText
        }

        axios.post('http://localhost:9876/posts', data)
            .then((response) => {
                const postJson = response.data
                const post = new Post(postJson.id, postJson.text, postJson.created_at)
                const posts = state.posts
                posts.unshift(post)
                setState({...state, posts: posts, postText: ''})
            }).catch((e) => {
            console.log(e)
        })
    }

    return (
        <div className={'main'}>

            <h1 style={{marginTop: '10px'}}>Home</h1>

            <div className={'input-container'}>
                <div className={'profile-container'}>
                    <Image
                        className={'profile-image'}
                        src={'/ran1.jpeg'} alt={'profile'}
                        width={48}
                        height={48}
                    />
                </div>

                <div className={'right-container'}>
                    <TextareaAutosize
                        minRows={2}
                        className={'input'}
                        aria-label="maximum height"
                        placeholder={'What\'s on your mind?'}
                        value={state.postText}
                        onChange={(e) => {
                            setState({...state, postText: e.target.value})
                        }}
                    />
                    <div className={'submit-container'}>
                        <button
                            className={'submit-button'}
                            onClick={() => {
                                didClickOnPostButton()
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            <div className={'post-container'}>

                {
                    state.posts.length == 0 &&
                    <div className={'text-center empty-container'}>
                        No posts yet
                    </div>
                }

                {
                    state.posts.length != 0 &&
                    state.posts.map((post, index) => {
                        return <div
                            key={index + post.id + post.text + post.createdAt}
                            className={'content-container'}
                        >
                            <div className={'left-container'}>
                                <Image
                                    className={'profile-image'}
                                    src={'/ran1.jpeg'} alt={'profile'}
                                    width={48}
                                    height={48}
                                />
                            </div>

                            <div className={'right-container'}>
                                <div className={'profile-container'}>
                                    <p className={'user-name'}>
                                        Random User name
                                    </p>

                                    <div className={'time-container'}>
                                        <p className={'created-at'}>
                                            {post.timeSince()} ago

                                        </p>

                                    </div>
                                </div>

                                <div>
                                    <TextareaAutosize
                                        readOnly={true}
                                        className={'post-display'}
                                        aria-label="maximum height"
                                        placeholder={'What\'s on your mind?'}
                                        value={post.text}
                                    />
                                </div>

                                <div className={'bottom-bar'}>
                                    <div className={'component'}>
                                        <Image src={'/message.png'} alt={'ss'} width={15} height={15}/>
                                        <div style={{marginLeft: '5px'}}>
                                            {post.numbeOfComments}
                                        </div>
                                    </div>

                                    <div className={'component'}>
                                        <Image src={'/hearth.png'} alt={'ss'} width={15} height={15}/>
                                        <div style={{marginLeft: '5px'}}>
                                            {post.numberOfLikes}
                                        </div>
                                    </div>

                                    <div className={'component'}>
                                        <Image src={'/share.png'} alt={'ss'} width={15} height={15}/>
                                        <div style={{marginLeft: '5px'}}>
                                            {post.numberOfShares}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    })
                }

            </div>


        </div>
    )
}
