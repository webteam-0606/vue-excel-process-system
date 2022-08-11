import psycopg2
# import postgres
import sys
import io
import xlrd
import base64
# from datetime import datetime
import datetime
from xlrd import xldate_as_tuple
# 根据有多少个sheets去创建多少个表，path为excel表格的路径

def createtable():
    
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030') 
    # 读取excel
    path = 'C:/Users/320200255/project/vue-excel-process-system/import-excel/REFRESH_Defect_Records_ALL_FIELDS_NO_SOLUTION.xlsx'
    data = xlrd.open_workbook(path)
    # 根据sheet索引获取sheet的内容
    sheet_names = data.sheet_names()
    table_one = data.sheet_by_index(0)
    conn = psycopg2.connect(database='postgres-uploadsearch', user='postgres', password='postgres', host='localhost')
    cur = conn.cursor()
    for i in range(0, len(sheet_names)):
        # 当前sheet的名字
        print('sheet_names[i]---:', sheet_names[i])
        table_name = sheet_names[i]
        print('table_name:---', table_name)
        # 当前的sheet
        now_table = data.sheet_by_index(i)
        # 获得当前sheet的列数就是 属性数
        cols_num = now_table.ncols
        # 获得当前表格的行数，就是有多少的数据量
        rows_num = now_table.nrows
        print('rows_num:', rows_num)
        # 获得当前的属性的数组，其实就是第一例的值
        attrs = now_table.row_values(0)
        # 判断表格是否存在
        cur.execute("SELECT to_regclass('%s') is not null" % table_name)
        flag = cur.fetchone()[0]
        print('flag===', flag)
        if flag:
            # print('存在了,直接将表的内容插入')
            print('existed,insert the content of table directly')
            # 将当前的sheet插入到数据库
            for k in range(1, rows_num):
                row_vlaue = now_table.row_values(k)
                # print('row_vlaue:',row_vlaue)
                # print('join(attrs):',','.join(attrs))
                # 处理要插入的数据，把非字符串的数据转换成字符串类型，同事将字符串变成 sql语句需要的类型
                for a in range(0, len(row_vlaue)):
                    ctype = now_table.cell(k, a).ctype
                    # print('ctype', ctype)
                    # ctype： 0 empty,1 string, 2 number, 3 date, 4 boolean, 5 error
                    if ctype == 2 and row_vlaue[a] % 1 == 0:
                        tmp = int(row_vlaue[a])
                        row_vlaue[a] = str(tmp)
                    if ctype == 3:
                        d = datetime(*xldate_as_tuple(row_vlaue[a], 0))
                        row_vlaue[a] = d.strftime('%Y-%m-%d')
                    c = row_vlaue[a]
                    row_vlaue[a] = "'" + str(c) + "'"
                # print('join(row_vlaue):',','.join(row_vlaue))
                # print('table_name:',table_name)
                sql = "INSERT INTO %s(%s) VALUES(%s)" % (
                    table_name, ','.join(attrs), ','.join(row_vlaue))
                # sql = "INSERT INTO %s(%s) VALUES(%s)"
                print(sql)
                # print("before excute---------")
                cur.execute(sql)
                # print("after excute----------")
                conn.commit()
        else:
            print('table_name:', table_name)
            cur.execute("CREATE TABLE " + table_name + "();")
            conn.commit()
            # 为sheet进行建表，
            # cur.execute("ALTER TABLE %s ADD COLUMN  id SERIAL primary key  ;" % table_name)
            # conn.commit()

            # cur.execute("CREATE SEQUENCE users_id_seq  START WITH 1  INCREMENT BY 1  NO MINVALUE  NO MAXVALUE  CACHE 1;" )
            # conn.commit()

            # cur.execute("alter table  %s alter column id set default nextval('users_id_seq'); " % table_name)
            # conn.commit()
            for j in range(0, cols_num):   
                             
                cur.execute("ALTER TABLE %s ADD COLUMN %s VARCHAR;" %(table_name, attrs[j]))
                conn.commit()
            # 将当前的sheet插入到数据库
            for k in range(1, rows_num):
                row_vlaue = now_table.row_values(k)
                # print('row_vlaue:',row_vlaue)
                # print('join(attrs):', ','.join(attrs))
                # 处理要插入的数据，把非字符串的数据转换成字符串类型，同事将字符串变成 sql语句需要的类型
                for a in range(0, len(row_vlaue)):                                    
                    ctype = now_table.cell(k, a).ctype
                    # print('ctype', ctype)
                    # ctype： 0 empty,1 string, 2 number, 3 date, 4 boolean, 5 error
                    # if ctype == 1:
                    #     sw = bytes(row_vlaue[a],'utf-8')
                    #     st = base64.b64encode(sw)
                    #     sr=base64.b64decode(st)
                    #     row_vlaue[a] = sr.decode()
                    # ----
                    # if ctype == 2 and row_vlaue[a] % 1 == 0:
                    #     tmp = int(row_vlaue[a])
                    #     # row_vlaue[a] = str(tmp)
                    #     row_vlaue[a] = "'" + str(tmp) + "'"
                        # ----

                    # if ctype == 2 and row_vlaue[a] % 1 != 0:
                    #     print('row_vlaue[a]--',row_vlaue[a])
                    #     tmp = datetime(*xldate_as_tuple(row_vlaue[a], 0))
                    #     print('tmp--',tmp)
                    #     row_vlaue[a] = str(tmp)
                    # if ctype == 3:
                    #     d = datetime(*xldate_as_tuple(row_vlaue[a], 0))
                    #     row_vlaue[a] = d.strftime('%Y-%m-%d')
                    # ----
                    # elif ctype == 3:
                    #     # print('row_vlaue[a]--',row_vlaue[a])
                    #     tmp = datetime.datetime(*xldate_as_tuple(row_vlaue[a], 0))
                    #     # row_vlaue[a] = str(tmp)
                    #     row_vlaue[a] = "'" + str(tmp) + "'"
                        # ----
                        # print('tmp--',tmp)
                        # print('row_vlaue[a]----',row_vlaue[a])
                        # print('row_vlaue[a].type----',row_vlaue[a].type)
                        
                        # d = datetime(*xldate_as_tuple(row_vlaue[a], 0))
                        # row_vlaue[a] = datetime.datetime.strftime(d,'%Y/%m/%d %H:%M:%S')
                    # if ctype == 3:
                    #     d = xldate_as_tuple(row_vlaue[a], 0)
                    #     d1 = datetime(*d)
                    #     row_vlaue[a] = d1.strftime('%Y/%m/%d %H:%M:%S')
                    # ----
                    # else:                    
                    c = row_vlaue[a]
                    row_vlaue[a] = "'" + str(c) + "'"
                    print(' row_vlaue[a]=', row_vlaue[a])
                    row_vlaue[a]= row_vlaue[a].replace("\"","_")
                    row_vlaue[a]= row_vlaue[a].replace("'","_")
                    row_vlaue[a]= row_vlaue[a].replace("==","_")
                    row_vlaue[a]= row_vlaue[a].replace(";","_")
                    row_vlaue[a]= row_vlaue[a].replace(".","_")
                    print(' row_vlaue[a]==', row_vlaue[a])
                        # ----
                    # sw = bytes(row_vlaue[a],'utf-8')
                    # st = base64.b64encode(sw)
                    # sr=base64.b64decode(st)‘’“”
                    # row_vlaue[a] = sr.decode()
                    # row_vlaue[a] = row_vlaue[a].replace('\'','_')，？
                    i=i+1
                    print('i=',i)
                    print('else row_vlaue[a]----',row_vlaue[a])
                sql = "INSERT INTO %s(%s) VALUES(%s)" % (table_name, ','.join(attrs), ','.join(row_vlaue))
                print(sql)
                cur.execute(sql)
                conn.commit()
    conn.close()

createtable()
