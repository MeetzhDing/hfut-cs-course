#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>

//fifowrite
int main()
{
    char write_fifo_name[] = "fifo-pipe1"; //文件名
    char read_fifo_name[] = "fifo-pipe2";
    int write_fd, read_fd; //2个文件描述符
    char buf[256];
    int len;
    mkfifo(write_fifo_name, S_IRUSR | S_IWUSR); //创建有名管道
    write_fd = open(write_fifo_name, O_WRONLY);
    while ((read_fd = open(read_fifo_name, O_RDONLY)) == -1) //打开“读管道”，文件描述符为read_fd
    {
        printf("Wait for %s...\n", read_fifo_name);
        sleep(1);
    }
    while (1)
    {
        printf("Write: ");
        fgets(buf, 256, stdin);            //标准输入，存入buf中
        buf[strlen(buf) - 1] = '\0';       //最后一个字符替换为null
        write(write_fd, buf, strlen(buf)); //将buf写入管道
        len = read(read_fd, buf, 256);     //从管道中读取
        if (len > 0)
        {
            buf[len] = '\0'; //将buf的最后一个字符替换为null
            printf("Read: %s\n", buf);
        }
    }
}