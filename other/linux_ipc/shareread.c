#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>

void main(int argc, char **argv)
{
    int shm_id, i;
    key_t key;
    char *p_map;
    key = ftok(".",'a'); //得到keyid，利用了inode号
    if (key == -1)
        perror("ftok error");
    shm_id = shmget(key, 4096, 0666); //获得共享内存区域
    if (shm_id == -1)
    {
        perror("shmget error");
        return;
    }
    // 将共享内容与当前进程建立联系
    p_map = (char *)shmat(shm_id, NULL, 0);
    while(1){
        if(*(p_map)){
            printf("Read: %s\n", (p_map+1));
            *(p_map)=0;
        }
        sleep(1);
    }
}
