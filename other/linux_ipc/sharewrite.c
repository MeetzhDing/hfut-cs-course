#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>

void main(int argc, char **argv){
    int shm_id, i;
    key_t key;
    char *p_map;
    char buf[256];
    key = ftok(".", 'a');
    if (key ==-1)
        perror("ftok error");
    shm_id = shmget(key, 4096, IPC_CREAT | 0666);
    if (shm_id ==-1)
    {
        perror("shmget error");
        return;
    }
    p_map = (char *)shmat(shm_id, NULL, 0);
    *(p_map) = 0;
    while(1){
        printf("Write: ");
        fgets(p_map+1, 256, stdin);  //标准输入，存入buf中
        *(p_map) = 1;
        sleep(1);
    }
    return;
}
