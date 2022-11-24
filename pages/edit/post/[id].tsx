import styles from 'styles/editPost.module.scss'
import LayoutAdmin from "../../../components/layoutAdmin";
import Blocks from '../../../components/blocks';
import { useEffect, useState } from "react";

export default function PostEdit() {

    const [isLoading, setIsLoading] = useState(true)
    const [postId, setPostId] = useState<any>()
    const [posts, setPosts] = useState<any>()


    useEffect(() => {
        (async () => {
            const data = await fetch('/api/posts').then(val => val.json())
            setPosts(data)
            setPostId(document.URL.split('post/')[1])
            setIsLoading(false)
        })()
    }, []);

    return (
        <LayoutAdmin>
            {isLoading ? 'Loading...' 
            : 
            <div className={styles.wrap}>
                <Blocks postId={postId} blocksData={posts[postId].blocks} />
            </div>}
        </LayoutAdmin>
    );
}