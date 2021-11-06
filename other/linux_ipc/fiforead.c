#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>

//fiforead
int main(void)
{
    char write_fifo_name[] = "fifo-pipe2"; //文件名
    char read_fifo_name[] = "fifo-pipe1";  //与第1个程序对调
    int write_fd, read_fd;
    char buf[256];
    int len;
    mkfifo(write_fifo_name, S_IRUSR | S_IWUSR);
    while ((read_fd = open(read_fifo_name, O_RDONLY)) == -1) //打开"读管道"，这个管道是上一程序的写管道
    {
        sleep(1);
    }
    write_fd = open(write_fifo_name, O_WRONLY);
    while (1)
    {
        len = read(read_fd, buf, 256); //先从管道中读取
        if (len > 0)
        {
            buf[len] = '\0';
            printf("Write: %s\n", buf);
        }
        printf("Read: ");
        fgets(buf, 256, stdin); //将标准输入存入buf
        buf[strlen(buf) - 1] = '\0';
        write(write_fd, buf, strlen(buf));
    }
}